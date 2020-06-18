<template>
    <div v-if="!avatar">
        <header>
            <span class="title">Note Online</span>
            <a class="login" href="http://localhost:3000/auth/github">
                <AIcon name="github" />
                GitHub
            </a>
        </header>
        <main>
            <div class="welcome">
                <h1>点击右上角登陆</h1>
            </div>
        </main>
    </div>
    <div v-else>
        <header>
            <span class="title">Note Online</span>
            <div class="create-note" @click.stop="createNote">
                <AIcon name="add" />
            </div>
            <a class="logout" href="javascript:void(0);" @click="logout">
                <img v-if="avatar" :src="avatar" alt="头像">
                注销账户
            </a>
        </header>
        <main>
            <div v-for="(note, index) in notes" class="note" :data-id="note.id" :key="note.id">
                <div class="tip">
                    <span class="time">{{transformTime(note.updatedAt)}}</span>
                    <span class="delete" @click.stop="destroyNote(note.id, index)"><AIcon name="clear" /></span>
                </div>
                <div class="line"></div>
                <div class="content" contenteditable="true" data-text
                    @blur="updateNote(note.id, $event.target.innerHTML, index)"
                    v-html="note.content"></div>
            </div>
        </main>
    </div>
</template>

<script>
    import { ref, nextTick } from 'vue'
    import http from '@/http'

    export default {
        setup () {
            const avatar = ref('')
            const notes = ref([])

            const createNote = async () => {
                try {
                    const res = await http.post('/note')
                    notes.value.push(res.data.data)
                    await nextTick()
                    const noteContent = document.getElementsByClassName('content')
                    noteContent[noteContent.length - 1].focus()
                } catch (e) {
                    console.warn(e)
                }
            }

            const updateNote = async (id, content, index) => {
                try {
                    await http.put('/note', { id, content })
                    notes.value[index].content = content
                    console.log('更新成功')
                } catch (e) {
                    console.warn(e)
                }
            }

            const destroyNote = async (id, index) => {
                try {
                    await http.delete('/note?id=' + id)
                    notes.value.splice(index, 1)
                } catch (e) {
                    console.warn(e)
                }
            }

            const logout = async () => {
                await http.get('/user/logout')
                avatar.value = ''
                notes.value = []
            }

            http.get('/user/info').then(res => {
                avatar.value = res.data?.data?.avatar || ''
                http.get('/note').then(res => {
                    notes.value = res.data?.data || []
                }).catch(err => {
                    console.warn(err)
                })
            }).catch(err => {
                console.warn(err)
            })

            return {
                avatar,
                notes,
                transformTime,
                createNote,
                updateNote,
                destroyNote,
                logout
            }
        }
    }

    function transformTime (val) {
        return new Date(val).toLocaleString()
    }
</script>

<style>
    @import "~@/css/reset.css";
    @import "~@/css/variable.css";
    #app {
        color: $fontColor;
        header {
            display: flex;justify-content: space-between;align-items: center;
            padding: 0 8%;
            height: 66px;
            background: #fff;
            .title {
                width: 140px;text-align: center;
                font-size: 24px;font-weight: 600;
                color: #00D2AA;
            }
            .login {
                display: flex;justify-content: space-between;align-items: center;
                padding: 0 12px 0 3px;vertical-align: middle;
                width: 120px;height: 34px;
                font-size: 16px;font-weight: 500;
                color: #fff;background: #00D2AA;
                border-radius: 17px;
                svg {
                    width: 28px;height: 28px;display: flex;align-items: center
                }
                cursor: pointer;
            }
            .create-note {
                display: flex;justify-content: center;align-items: center;
                width: 36px;height: 36px;
                border-radius: 20px;cursor: pointer;
                background: #00d2aa;
                > svg {
                    width: 24px;height: 24px;color: #fff;
                }
            }
            .logout {
                display: flex;justify-content: space-between;align-items: center;
                padding-right: 12px;vertical-align: middle;
                width: 120px;height: 34px;
                font-size: 16px;font-weight: 500;
                color: #fff;background: #00D2AA;
                border-radius: 17px;
                cursor: pointer;
                img {
                    width: 28px;height: 28px;border-radius: 50%;margin-left: 3px;
                }
            }
        }
        main {
            color: rgba(0, 0, 0, 0.65);font-size: 14px;
            display: flex;flex-flow: wrap;align-items: flex-start;
            padding: 6px 3%;
            .welcome {
                height: 120px;width: 100%;
                display: flex;justify-content: center;align-items: center;
            }
            > .note {
                display: flex;flex-flow: column;
                margin: 16px;
                width: 240px;
                background: #fff;
                border-radius: 4px;box-shadow: 1px 1px 10px 1px #ddd;
                .tip {
                    display: flex;justify-content: space-between;align-items: center;
                    padding: 8px;
                    color: #bbb;
                    svg {height: 16px;width: 16px;}
                    > .delete {
                        display: flex;justify-content: center;align-items: center;
                        cursor: pointer;
                    }
                }
                .line {
                    margin: 0 8px;
                    height: 1px;background: #dfdfdf;
                }
                .content {
                    padding: 8px;
                    outline: none;
                }
                [contentEditable=true]:empty:not(:focus):before {
                    content: '请在此添加您的便签内容';
                    color: #bbb;
                    cursor: text;
                }
            }
        }
    }
</style>
